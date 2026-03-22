import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import styles from "../../assets/css/Admin/UsersManagement.module.scss";

export default function UsersManagement() {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const { data } = await supabase
            .from("personas")
            .select("*");

        setUsers(data || []);
    };

    const changeRole = async (id, newRole) => {

        await supabase
            .from("personas")
            .update({ rol: newRole })
            .eq("id", id);

        loadUsers();
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Gestión de Usuarios</h2>
            <div className={styles.card}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className={styles.row}>
                                <td>{user.nombre}</td>
                                <td className={styles.role}>
                                    {user.rol}
                                </td>
                                <td className={styles.actions}>
                                    <button
                                        className={`${styles.button} ${styles.leader}`}
                                        onClick={() => changeRole(user.id, "lider")}
                                    >
                                        Lider
                                    </button>
                                    <button
                                        className={`${styles.button} ${styles.member}`}
                                        onClick={() => changeRole(user.id, "miembro")}
                                    >
                                        Miembro
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}