export type SiteConfig = {
	heroImageUrl: string;
	galleryImageUrls: string[];
};

// Dodaj svoje Cloudinary URL-ove u niz ispod.
// Primer (dobijen od tebe): https://res.cloudinary.com/dvohrn0zf/image/upload/v1762778197/365_henqno.jpg
// Preporuka: koristi Cloudinary transformacije za optimizaciju: f_auto,q_auto,w_1600 (hero) i w_900 (galerija)
const cloudName = "dvohrn0zf";
const sample = "https://res.cloudinary.com/dvohrn0zf/image/upload/v1762778197/365_henqno.jpg";

export const siteConfig: SiteConfig = {
	heroImageUrl: sample.replace("/upload/", "/upload/f_auto,q_auto,w_1600,c_fill/"),
	galleryImageUrls: [
		sample.replace("/upload/", "/upload/f_auto,q_auto,w_900,c_fill/"),
		// Dodaj ostale URL-ove ispod (jedan po liniji):
		// "https://res.cloudinary.com/dvohrn0zf/image/upload/f_auto,q_auto,w_900,c_fill/<public_id>.jpg",
	],
};

export default siteConfig;

