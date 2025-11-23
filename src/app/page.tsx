"use client";

import  Link  from "next/link";
import {  Link as HeroLink, Button } from "@heroui/react";


export default function Home() {
	return (
		<Link href="/room/1">
			<Button
				as={HeroLink}
				color="primary"	
				variant="solid"
			>
				Button Link
			</Button>
		</Link>
	);
}
