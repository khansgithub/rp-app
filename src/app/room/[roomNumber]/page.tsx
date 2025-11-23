import Chat from "./Chat";
import { ThemeSwitcher } from "@/app/components/ThemeSwitcher";

export default async ({ params }: { params: Promise<{ roomNumber: string }> }) => {
	const roomNumber = (await params).roomNumber;
	return (
		<>
			<ThemeSwitcher />
			<Chat roomNumber={roomNumber} />
		</>
	);
}
