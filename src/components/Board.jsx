export default function Board({results, formatTime}) {
    const sortedResults = [...results].sort((a, b) => a - b);
    const bestRes = sortedResults.slice(0, 5);
    return (
        <>
            <table className="results-table" >
                <thead>
                    <tr>
                        <th>Номер</th>
                        <th>Время</th>
                    </tr>
                </thead>
                <tbody>
                {bestRes.map((el, index) => {
                    return (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{formatTime(el+10)}</td>
                        </tr>  
                    )
                })}
                </tbody>
                
            </table>
        </>
    )
}