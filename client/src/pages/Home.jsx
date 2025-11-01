import Banner from "../components/Banner";
import BestSeller from "../components/BestSeller";
import Category from "../components/Category";

import FastDelivery from "../components/FastDelivery";

const Home = () => {
  return (
    <div className="mt-3 ">
      <Banner />
      <Category />
      <BestSeller />
      <FastDelivery />
  
    </div>
  );
};
export default Home;
