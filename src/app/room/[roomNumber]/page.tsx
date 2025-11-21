import App from "./App";
import { ThemeSwitcher } from "@/app/components/ThemeSwitcher";

export default async ({ params }: { params: Promise<{ roomNumber: string }> }) => {
	const roomNumber = (await params).roomNumber;
	return (
		<>
			<ThemeSwitcher />
			<App roomNumber={roomNumber} />
		</>
	);
}
