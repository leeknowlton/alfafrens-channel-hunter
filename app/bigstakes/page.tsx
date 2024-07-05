// app/stakes/page.tsx
import StakeList from "../../components/StakeList";

export default function StakesPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <StakeList />
    </main>
  );
}
