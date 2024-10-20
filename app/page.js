import Image from "next/image";
import Styles from "./page.module.css";
import { Main } from "./components/Home/Home";

export default function Home() {
  return (
    <main className={Styles.main}>
       <Main />
  </main>

  );
}