import { useEffect, useState } from "react";

function calc({ month, day }) {
    const now = new Date();
    const y = now.getFullYear();
    const start = new Date(y, month - 1, day);
    const end = new Date(y, month - 1, day + 1);

    // Le jour J : on bascule en mode fête
    if (now >= start && now < end) {
        return { j: 0, h: 0, m: 0, s: 0, isToday: true };
    }

    const target = now < start ? start : new Date(y + 1, month - 1, day);
    const diff = target - now;

    return {
        j: Math.floor(diff / 864e5),
        h: Math.floor((diff / 36e5) % 24),
        m: Math.floor((diff / 6e4) % 60),
        s: Math.floor((diff / 1e3) % 60),
        isToday: false,
    };
}

export default function useCountdown(birthday) {
    const [t, setT] = useState(() => calc(birthday));

    useEffect(() => {
        const id = setInterval(() => setT(calc(birthday)), 1000);
        return () => clearInterval(id);
    }, [birthday.month, birthday.day]);

    return t;
}