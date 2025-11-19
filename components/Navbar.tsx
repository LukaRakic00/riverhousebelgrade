"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export function Navbar() {
	const [open, setOpen] = useState(false);
	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ position: "sticky", top: 0, zIndex: 50 }}>
			<div className="container">
				<Link href="/" className="navbar-brand d-flex align-items-center gap-2">
					<Image
						src="/static/favicons/s25-removebg-preview.png"
						alt="Belgrade River House"
						width={40}
						height={40}
						priority
					/>
					<span className="d-none d-sm-inline">Belgrade River House</span>
				</Link>
				<button className="navbar-toggler" type="button" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className={`collapse navbar-collapse ${open ? "show" : ""}`}>
					<ul className="navbar-nav ms-auto mb-2 mb-lg-0">
						<li className="nav-item"><Link href="/" className="nav-link">Početna</Link></li>
						<li className="nav-item"><a href="#o-nama" className="nav-link">O nama</a></li>
						<li className="nav-item"><Link href="/galerija" className="nav-link">Galerija</Link></li>
						<li className="nav-item"><Link href="/cenovnik" className="nav-link">Cenovnik</Link></li>
						<li className="nav-item"><a href="#kontakt" className="btn btn-primary ms-lg-2">Kontakt</a></li>
					</ul>
				</div>
			</div>
		</nav>
	);
}


