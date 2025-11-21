import { Rooms } from "../types";

export default () => {
    const rooms: Rooms = new Map();
    rooms.set("foo", { count: 1 });
    rooms.set("bar", { count: 2 });
    return (
        <div>
            <a href="/room/1/"
            className="inline-block px-6 py-2 text-white dark:text-black bg-blue-500 hover:bg-blue-600 rounded-lg text-center">
                Start
            </a>
        </div>
    );
}