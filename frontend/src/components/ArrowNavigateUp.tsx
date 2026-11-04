import { ArrowUpCircle } from "lucide-react";

interface ArrowNavigateUpProps{
    handleUpNavigate: () => void;
}

export function ArrowNavigateUp ({handleUpNavigate}:ArrowNavigateUpProps){

    return (
        <div className="flex justify-center w-full py-4">
                <button
                    type="button"
                    onClick={handleUpNavigate}
                    className="hover:underline"
                >
                    <ArrowUpCircle className="w-16 h-16" aria-hidden="true" color="#537A63" />
                </button>

            </div>
    )
    
}