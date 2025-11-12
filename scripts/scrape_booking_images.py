import argparse
import os
import re
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup


def ensure_directory(path: str) -> None:
	"""
	Create directory if it doesn't exist.
	"""
	os.makedirs(path, exist_ok=True)


def sanitize_filename(name: str) -> str:
	"""
	Convert arbitrary string to a filesystem-friendly filename base.
	"""
	name = re.sub(r"[\\/:*?\"<>|]+", "-", name)
	name = re.sub(r"\s+", "-", name).strip("-")
	return name or "image"


def extract_image_urls_from_html(html: str) -> list[str]:
	"""
	Extract image URLs from Booking HTML using multiple strategies.
	"""
	soup = BeautifulSoup(html, "html.parser")
	image_urls: set[str] = set()

	# 1) <img> tags: src, data-src, data-lazy, srcset
	for img in soup.find_all("img"):
		candidates: list[str] = []
		for attr in ("src", "data-src", "data-lazy", "data-lazy-src"):
			val = img.get(attr)
			if val:
				candidates.append(val)
		srcset = img.get("srcset")
		if srcset:
			for part in srcset.split(","):
				url_part = part.strip().split(" ")[0]
				candidates.append(url_part)

		for cand in candidates:
			if not cand:
				continue
			if cand.startswith("//"):
				cand = "https:" + cand
			# Booking CDN usually
			if "cf.bstatic.com" in cand or "bstatic.com" in cand:
				image_urls.add(cand)

	# 2) Generic regex fallback for bstatic images
	regex_urls = re.findall(r"https?://[^\s\"']*bstatic\.com[^\s\"']+", html)
	for u in regex_urls:
		image_urls.add(u)

	# Normalize: strip query params commonly used for resizing to try for original
	normalized: set[str] = set()
	for url in image_urls:
		# Keep original too
		normalized.add(url)
		# Try to strip query to attempt higher resolution when available
		if "?" in url:
			base = url.split("?", 1)[0]
			normalized.add(base)

	# Filter by typical image extensions
	final_urls = {u for u in normalized if re.search(r"\.(jpg|jpeg|png|webp)(?:$|\?)", u, re.IGNORECASE)}
	return sorted(final_urls)


def download_one(session: requests.Session, url: str, out_dir: str, index: int) -> tuple[str, bool, str]:
	"""
	Download a single image URL to out_dir using an index-based filename.
	Returns (filepath, success, error_message).
	"""
	try:
		parsed = urlparse(url)
		ext_match = re.search(r"\.(jpg|jpeg|png|webp)(?:$|\?)", parsed.path, re.IGNORECASE)
		ext = "." + (ext_match.group(1).lower() if ext_match else "jpg")
		filename = f"{index:03d}{ext}"
		filepath = os.path.join(out_dir, filename)

		headers = {
			"User-Agent": (
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
				"(KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
			),
			"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
			"Accept-Language": "en-US,en;q=0.9, sr;q=0.8",
			"Referer": "https://www.booking.com/",
		}

		with session.get(url, headers=headers, stream=True, timeout=30) as resp:
			resp.raise_for_status()
			with open(filepath, "wb") as f:
				for chunk in resp.iter_content(chunk_size=64 * 1024):
					if chunk:
						f.write(chunk)
		return filepath, True, ""
	except Exception as e:  # noqa: BLE001
		return "", False, str(e)


def scrape_booking_images(url: str, out_dir: str, max_workers: int = 8) -> None:
	ensure_directory(out_dir)

	headers = {
		"User-Agent": (
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
			"(KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
		),
		"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
		"Accept-Language": "en-US,en;q=0.9, sr;q=0.8",
		"Cache-Control": "no-cache",
	}

	with requests.Session() as session:
		resp = session.get(url, headers=headers, timeout=45)
		resp.raise_for_status()
		html = resp.text

		image_urls = extract_image_urls_from_html(html)
		if not image_urls:
			print("Nije pronadjena nijedna slika.", file=sys.stderr)
			return

		print(f"Pronadjeno URL-ova slika: {len(image_urls)}")

		results = []
		with ThreadPoolExecutor(max_workers=max_workers) as executor:
			futures = {executor.submit(download_one, session, img_url, out_dir, i): img_url for i, img_url in enumerate(image_urls, start=1)}
			for future in as_completed(futures):
				img_url = futures[future]
				filepath, ok, err = future.result()
				if ok:
					print(f"OK  - {img_url} -> {filepath}")
					results.append(filepath)
				else:
					print(f"ERR - {img_url} -> {err}", file=sys.stderr)

		print(f"Sacuvano slika: {len(results)} u folder: {out_dir}")


def main() -> None:
	parser = argparse.ArgumentParser(description="Preuzimanje slika sa Booking stranice objekta.")
	parser.add_argument(
		"--url",
		type=str,
		default="https://www.booking.com/hotel/rs/belgrade-river-house.sr.html",
		help="Booking URL objekta.",
	)
	parser.add_argument(
		"--out",
		type=str,
		default=os.path.join(os.getcwd(), "booking_images", "belgrade-river-house"),
		help="Izlazni folder za slike.",
	)
	parser.add_argument(
		"--workers",
		type=int,
		default=8,
		help="Broj paralelnih preuzimanja.",
	)
	args = parser.parse_args()

	print(f"URL: {args.url}")
	print(f"Folder: {args.out}")
	print(f"Workers: {args.workers}")

	scrape_booking_images(args.url, args.out, args.workers)


if __name__ == "__main__":
	main()

