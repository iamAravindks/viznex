import useFetch from "../../hooks/useFetch"


const ReportsPage = () => {
    const {data, loading,error} = useFetch('/report/ad/644827c4d45c5df8056a3c61')
    console.log(data)


    return(
        <div className="px-12 py-20">
            <h1 className="text-3xl font-bold">Reports</h1>
            <p>Please select </p>
        </div>
    )
}

export default ReportsPage