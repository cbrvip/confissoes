import { ReactNode } from "react";
import './index.scss'

export function Container({children}: { children: ReactNode } ){
    return (
        <div className="container">
            {children}
        </div>
    )
}