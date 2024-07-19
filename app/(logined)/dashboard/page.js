import BoardTable from "@/app/_components/BoardTable";

const Dashboard = () => {
    return (
        <main className="flex-[1] overflow-y-auto">
            <BoardTable id="boardtable" />
        </main>
    );
}

export default Dashboard;