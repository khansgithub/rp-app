"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "@heroui/switch";

export function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    const modes: Record<string, string> = {
        "light": "dark",
        "dark": "light",
    };
    useEffect(() => {
        setMounted(true)
    }, []);

    if (!mounted) return null

    return (
        <>
            <Switch defaultSelected aria-label="Automatic updates" onChange={() => setTheme(modes[theme ?? "light"])} />
        </>
    )
};