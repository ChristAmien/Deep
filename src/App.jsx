import Navbar from "./component/Navbar";
import Hero from "./component/Hero";
import Special from "./component/Special";
import Messages from "./component/Messages";
import Gallery from "./component/Gallery";
import Programme from "./component/Programme";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Special />
        <Messages />
        <Gallery />
        <Programme />
      </main>
    </>
  );
}