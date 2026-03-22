import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [nombre, setNombre] = useState(null);
    const [correo, setCorreo] = useState(null);
    const [rol, setRol] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                setLoading(false);
                return;
            }

            const userId = session.user.id;

            const { data, error } = await supabase
                .from("personas")
                .select("nombre, correo, rol")
                .eq("id", userId)
                .single();

            if (!error && data) {
                setUser(session.user);
                setNombre(data.nombre);
                setCorreo(data.correo);
                setRol(data.rol);
            }

            setLoading(false);
        };

        loadUser();

        const { data: listener } = supabase.auth.onAuthStateChange(() => {
            loadUser();
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    return (
        <UserContext.Provider
            value={{
                user,
                nombre,
                correo,
                rol,
                loading,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
