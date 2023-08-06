import { Container } from "../../../components/container";
import { FiUpload, FiTrash } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { Input } from "../../../components/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useState, useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { storage, db } from "../../../services/firebaseConnection";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from "firebase/storage";
import { addDoc, collection} from "firebase/firestore";
import './index.scss';

const schema = z.object({
    title: z.string().nonempty("O campo titúlo é obrigatório"),
    description: z.string().nonempty("O campo descrição é obrigatório"),
})

type FormData = z.infer<typeof schema>;


interface ImageItemProps{
    uid: string;
    name: string;
    previewUrl: string;
    url: string;
}

export function Post() {

    const { user } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    });

    const [postImages, setPostImages] = useState<ImageItemProps[]>([]);

    async function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if(e.target.files && e.target.files[0]) {
            const image = e.target.files[0]

            if(image.type === 'image/jpeg' || image.type === 'image/png') {
               await handleUpload(image)
            }else {
                alert('A imagem deve ser JPEG ou PNG!');
                return;
            }
        }
    }

    async function handleUpload(image: File) {
        if(!user?.uid) {
            return;
        }

        const currentUid = user?.uid;
        const uidImage = uuidV4();

        const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`);

        uploadBytes(uploadRef, image)
        .then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadURL) => {
                const imageItem = {
                    name: uidImage,
                    uid: currentUid,
                    previewUrl: URL.createObjectURL(image),
                    url: downloadURL,
                }

                setPostImages((images) => [...images, imageItem] );
                
                console.log(downloadURL);
            })
        })

    }

    function onSubmit(data: FormData) {

        if(postImages.length === 0) {
            toast.error("Envie pelo menos uma imagem do post!")
            return;
        }

        const postListImages = postImages.map ( post => {
            return{
                uid: post.uid,
                name: post.name,
                url: post.url
            }
        })

        addDoc(collection(db, "posts"), {
            title: data.title.toUpperCase(),
            description: data.description,
            created: new Date(),
            owner: user?.name,
            uid: user?.uid,
            images: postListImages,
        })
        .then(() => {
            reset();
            setPostImages([]);
            toast.success("Post cadastrado com sucesso!")
            
        })
        .catch((error) => {
            console.log(error)
        })

        console.log(data);
    }

    async function handleDeleteImage(item: ImageItemProps) {
        const imagePath = `images/${item.uid}/${item.name}`;

        const imageRef = ref(storage, imagePath);

        try {
            await deleteObject(imageRef);
            setPostImages(postImages.filter((post) => post.url !== item.url));
        } catch(err) {
            	console.log("ERRO AO DELETAR");
        }
    }

    return (
        <Container>
            <div className="newPost">
                <h1>Novo Post</h1>

                <div className="formPost">
                <div className="w-full p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
                <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
                    <div className="absolute cursor-pointer">
                        <FiUpload size={30} color="#FFF"></FiUpload>
                    </div>
                    <div className="cursor-pointer">
                        <input className="opacity-0 cursor-pointer" type="file" accept="image/*" onChange={handleFile} />
                    </div>
                </button>
                {postImages.map( item => (
                    <div key={item.name} className="w-full h-32 flex items-center justify-center relative">
                        <button className="absolute" onClick={() => handleDeleteImage(item)}>
                            <FiTrash size={28} color="#FFF"/>
                        </button>
                        <img src={item.previewUrl} className="rounded-lg w-full h-32 object-cover" />
                    </div>
                ))}
            </div>
            <form
                className="w-full"
                onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="inputForm">
                        <p>Titulo</p>
                        <Input 
                        type="text"
                        register={register}
                        name="title"
                        error={errors.title?.message}
                        placeholder="Digite um titúlo para a postagem..."
                        />
                    </div>
                    <div className="inputForm">
                        <p>Descrição do Post</p>
                        <Input 
                        type="description"
                        register={register}
                        name="description"
                        error={errors.description?.message}
                        placeholder="Digite uma descrição para a postagem..."
                        />
                    </div>
                    <button
                    type="submit"
                    className="w-full h-10 rounded-md mt-5 bg-zinc-900 text-white font-medium"
                    >
                    Cadastrar
                    </button>

            </form>

                </div>
            </div>
        </Container>
    )
}