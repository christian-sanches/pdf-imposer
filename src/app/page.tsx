import { ImposerContainer } from "@src/components/imposer/ImposerContainer";
import { Footer } from "@src/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <ImposerContainer />
      </main>
      <Footer />
    </div>
  );
}
