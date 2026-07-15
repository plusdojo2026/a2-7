import { useEffect, useState } from "react";
import axios from "axios";
function Notice() {
    const [garbageMessage, setGarbageMessage] = useState("");
    useEffect(() => {
        axios.get("/api/home/garbage")
            .then((res) => {
                const garbageList = res.data;

                let today = new Date().getDay();

                if (today === 0) {
                    today = 7;
                }

                const todayGarbage = garbageList.filter(
                    (garbage) => garbage.garbage_day === today
                );

                if (todayGarbage.length > 0) {
                    setGarbageMessage(
                        `今日は${todayGarbage[0].garbageType}の日です`
                    );

                } else {

                    setGarbageMessage("今日はゴミの日ではありません");

                }
            });

    }, []);

    return (
        <div>
            <h2>お知らせ</h2>
            <p>{garbageMessage}</p>
        </div>
    );
}

export default Notice;