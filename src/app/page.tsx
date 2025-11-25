"use client";

import Link from "next/link";
import { Link as HeroLink, Button, PressEvent, input, snippet } from "@heroui/react";
import { Input } from "@heroui/react";
import { useRef, useState } from "react";
import { useUserStore } from "./store/store";



export default function Home() {
	const [inputValue, setInputValue] = useState("");
	const [inputValueisValid, setInputValueisValid] = useState(false);
	const { setName } = useUserStore();
  	const joinButton = useRef(null);
	
	function sanitiseInput(s: string): string | undefined {
		return (s.toLowerCase().trim().match(/[a-z0-9\uAC00-\uD7AF]*/g) ?? []).join("");
	}

	function validateInput(s: string) {
		return s.length >= 3;
	}

	return (
		<div className="w-2/4 flex flex-col place-items-center gap-4">
			<div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
				<Input
					label="Enter name"
					type="name"
					onChange={(e) => {
						const s_input = sanitiseInput(e.target.value);
						if (!s_input) return;
						setInputValue(s_input);
						setInputValueisValid(validateInput(s_input));
						console.log(sanitiseInput(e.target.value), inputValueisValid);
						// .match(/[a-z0-9\uAC00-\uD7AF]/g)?.join("") ?? ""
					}}
					onKeyDown={e => {
						if (e.key == "Enter"){
							(joinButton.current as any as  HTMLButtonElement).click();
						}
					}}
					isInvalid={!inputValueisValid && inputValue.length != 0}
					isRequired={true}
				/>
			</div>
			<Button
			ref={joinButton}
				as={Link}
				href={"/room/1"}
				color="primary"
				variant="solid"
				className={"w-full"}
				isDisabled={inputValue.length < 3}
				onClickCapture={e => {
					if (validateInput(inputValue)) {
						setName(`${inputValue[0].toUpperCase() + inputValue.slice(1)}`)
						return
					}
					else e.preventDefault();
				}}
			>
				Join
			</Button>
		</div>
	);
}
