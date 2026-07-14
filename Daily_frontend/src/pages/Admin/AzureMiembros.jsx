import Informacion from "../../components/Admin/Azure/AzureMiembros/Informacion";
import { useAzureMembers } from "../../hooks/AzureMiembros/useAzureMembers";

export default function AzureMiembros() {
    const azure = useAzureMembers();

    return <Informacion {...azure} />;
}

