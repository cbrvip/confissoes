import { Container } from "../../components/container";
import { Navbar } from "../../components/navbar";
import { AuthContext } from "../../../contexts/AuthContext";
import { useContext } from "react";

export function Dashboard() {

    const { user } = useContext(AuthContext);

    const isAdmin = user && user.admin === 1;


    return (
            <Container>
                {isAdmin && (
                    <Navbar />
                )}
            </Container>
    )
}