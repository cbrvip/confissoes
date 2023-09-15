import { Header } from '../../components/header';
import { Container } from '../../components/container';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../services/firebaseConnection';
import { sendPasswordResetEmail } from 'firebase/auth';
import toast from 'react-hot-toast';

export function Lost() {
    const navigate = useNavigate();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const email = e.currentTarget.email.value;
    
        try {
            await sendPasswordResetEmail(auth, email);
            navigate('/login');
            toast.success('E-mail enviado com sucesso!', {
                position: 'bottom-right',
          });
        } catch (error) {
            toast.success('Erro ao enviar e-mail de recuperação de senha!', {
                position: 'bottom-right',
          });
            console.error(error);
        }
    };

    return (
        <>
          <Header />
          <Container>
            <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
              <form
                className="bg-white max-w-xl w-full rounded-lg p-4"
                onSubmit={onSubmit}
              >
                <h1 className="text-xl mb-2">Digite seu e-mail para recuperar a senha</h1>
                <div className="mb-3">
                    
                  <input
                    className="w-full border-2 rounded-md h-11 px-2"
                    type="email"
                    placeholder="Digite seu email..."
                    name="email"
                  />
                </div>
                <button
                  className="bg-zinc-900 w-full rounded-md text-white h-10 font-medium"
                  type="submit"
                >
                  Enviar
                </button>
                <Link to="/login">
                <h1 className="mt-3 text-sm">Voltar para página de login</h1>
              </Link>
              </form>
            </div>
          </Container>
        </>
      );
}