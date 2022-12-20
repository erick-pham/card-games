import Head from "next/head";
import styles from "styles/Home.module.css";
import NavBar from "./NavBar";
import MyFooter from "./MyFooter";

export const MainLayout = (props: {
  children: any,
  pageTitle: string
}) => {
  const { children, pageTitle } = props;
  return (
    <div className={styles.container}>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <NavBar></NavBar>
      {children}
      <MyFooter></MyFooter>
    </div>
  );
};

export default MainLayout;
