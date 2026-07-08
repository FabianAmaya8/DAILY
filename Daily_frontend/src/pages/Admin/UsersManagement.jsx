import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Users, AlertOctagon } from "lucide-react";
import { supabase } from "../../utils/supabaseClient";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Skeleton } from "../../components/ui/Skeleton";
import styles from "../../assets/css/Admin/UsersManagement.module.scss";

const ROLE_VARIANTS = {
    admin: "danger",
    lider: "warning",
    miembro: "info",
};

export default function UsersManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [savingId, setSavingId] = useState(null);

    const loadUsers = async () => {
        setLoading(true);
        setError(null);
        const { data, error: e } = await supabase
            .from("personas")
            .select("id,nombre,correo,rol,activo")
            .order("nombre");
        if (e) setError(e);
        else setUsers(data || []);
        setLoading(false);
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const changeRole = async (user, newRole) => {
        if (user.rol === newRole) return;
        const ok = await Swal.fire({
            icon: "question",
            title: `Cambiar rol a "${newRole}"?`,
            text: `Le cambiarás el rol a ${user.nombre}. Esta acción queda registrada en auditoría.`,
            showCancelButton: true,
            confirmButtonText: "Sí, cambiar",
            cancelButtonText: "Cancelar",
        });
        if (!ok.isConfirmed) return;

        setSavingId(user.id);
        const { error: e } = await supabase
            .from("personas")
            .update({ rol: newRole })
            .eq("id", user.id);
        setSavingId(null);

        if (e) {
            Swal.fire({ icon: "error", title: "Error", text: e.message });
        } else {
            await loadUsers();
        }
    };

    return (
        <div className={styles.page}>
            <header className={styles.pageHeader}>
                <h1 className={styles.title}>
                    <Users size={20} aria-hidden="true" />
                    Gestión de usuarios
                </h1>
                <p className={styles.subtitle}>
                    Administra roles del equipo. Los cambios entran en vigor de
                    inmediato.
                </p>
            </header>

            {error ? (
                <EmptyState
                    icon={AlertOctagon}
                    title="No se pudo cargar la lista de personas"
                    description={error.message}
                />
            ) : (
                <Card padding="sm">
                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Persona</th>
                                    <th>Correo</th>
                                    <th>Rol</th>
                                    <th className={styles.thRight}>Cambiar a</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading
                                    ? Array.from({ length: 5 }).map((_, i) => (
                                          <tr key={i}>
                                              <td colSpan={4}>
                                                  <Skeleton variant="line" />
                                              </td>
                                          </tr>
                                      ))
                                    : users.map((u) => (
                                          <tr key={u.id}>
                                              <td className={styles.name}>
                                                  {u.nombre}
                                              </td>
                                              <td className={styles.muted}>
                                                  {u.correo}
                                              </td>
                                              <td>
                                                  <Badge
                                                      variant={
                                                          ROLE_VARIANTS[u.rol] ||
                                                          "neutral"
                                                      }
                                                      size="sm"
                                                  >
                                                      {u.rol}
                                                  </Badge>
                                              </td>
                                              <td>
                                                  <div className={styles.actions}>
                                                      {["miembro", "lider", "admin"].map(
                                                          (r) => (
                                                              <Button
                                                                  key={r}
                                                                  size="sm"
                                                                  variant={
                                                                      u.rol === r
                                                                          ? "primary"
                                                                          : "ghost"
                                                                  }
                                                                  loading={
                                                                      savingId === u.id &&
                                                                      u.rol !== r
                                                                  }
                                                                  disabled={
                                                                      u.rol === r ||
                                                                      savingId !== null
                                                                  }
                                                                  onClick={() =>
                                                                      changeRole(u, r)
                                                                  }
                                                              >
                                                                  {r}
                                                              </Button>
                                                          ),
                                                      )}
                                                  </div>
                                              </td>
                                          </tr>
                                      ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
}
