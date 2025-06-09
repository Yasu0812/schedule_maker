import logo from "@/assets/logo.png";
import Image from "next/image";

export default function Header() {
    return (
        <header className="text-white p-4 sticky top-0 bg-blue-100 shadow-md z-50 rounded-b-lg">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Image src={logo} alt={""} width={150} />
                </div>
                <nav>
                    <ul className="flex space-x-4">
                    </ul>
                </nav>
            </div>
        </header>
    );
}