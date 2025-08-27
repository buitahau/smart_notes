import { useState } from "react";

type Route = string;

export function useMiniRouter(initial: Route) {
    const [route, setRoute] = useState<Route>(initial);
    const [params, setParams] = useState<Record<string, any>>({});

    const navigate = (to: Route, params?: Record<string, any>) => {
        setRoute(to);
        setParams(params || {});
    }

    return {route, params, navigate};
}