import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import SideBar from "../../Layout/SideBar";

export default function ViewDashboard() {
    return <>
        <Bar />
        <SideBar />
        <Content>
            <img src="/icon.png" alt="icon" className="w-80 opacity-20 absolute ml-20 left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2" />
        </Content>
    </>
}