import RateAdmin from "../../../components/RateAdmin";
export const dynamic="force-dynamic";
export const metadata={title:"DV Towing rate administration",robots:{index:false,follow:false}};
export default function Page(){return <main className="wrap dv-archive"><p className="eyebrow">Owner access / Pricing control</p><h1>Rate management.</h1><RateAdmin/></main>;}
