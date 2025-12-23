import GameCarousel from "@/components/GameCarousel";
import MostPlayed from "@/components/MostPlayed";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sharp-black to-[#150012] text-white">
      <div className="pt-32">
        <GameCarousel />
        <MostPlayed />
      </div>
    </div>
  );
}
