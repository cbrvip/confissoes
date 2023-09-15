import { Container } from "../../../components/container";
import { FiUpload, FiTrash } from "react-icons/fi";
import { useForm } from "react-hook-form";
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
import { addDoc, collection } from "firebase/firestore";
import './index.scss';
import { useNavigate } from "react-router-dom";

const schema = z.object({
  description: z.string().nonempty("O campo descrição é obrigatório"),
})

type FormData = z.infer<typeof schema>;

interface ImageItemProps {
  uid: string;
  name: string;
  previewUrl: string;
  url: string;
  type: "image" | "video"; // Add a "type" property to distinguish between images and videos
}

export function Post() {

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    });

    const [postImages, setPostImages] = useState<ImageItemProps[]>([]);
    const [description, setDescription] = useState<string>("");

    function handleDescriptionChange(event: ChangeEvent<HTMLTextAreaElement>) {
        setDescription(event.target.value);
      }

    async function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
      
          if (file.type === 'image/jpeg' || file.type === 'image/png') {
            await handleUpload(file);
          } else if (file.type === 'video/mp4') {
            await handleVideoUpload(file);
          } else {
            alert('O arquivo deve ser uma imagem (JPEG ou PNG) ou um vídeo (MP4).');
            return;
          }
        }
      }

      async function handleVideoUpload(video: File) {
        if (!user?.uid) {
            return;
        }
    
        const currentUid = user?.uid;
        const videoUid = uuidV4();
    
        const uploadRef = ref(storage, `videos/${currentUid}/${videoUid}`);
    
        uploadBytes(uploadRef, video)
            .then((snapshot) => {
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    const videoItem: ImageItemProps = {
                        name: videoUid,
                        uid: currentUid,
                        previewUrl: '', // You can set a preview URL for videos if needed.
                        url: downloadURL,
                        type: "video", // Set the type to "video"
                    };
    
                    setPostImages((images) => [...images, videoItem]);
    
                    console.log(downloadURL);
                });
            });
    }

    async function handleUpload(image: File) {
        if (!user?.uid) {
            return;
        }
    
        const currentUid = user?.uid;
        const uidImage = uuidV4();
    
        const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`);
    
        uploadBytes(uploadRef, image)
            .then((snapshot) => {
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    const imageItem: ImageItemProps = {
                        name: uidImage,
                        uid: currentUid,
                        previewUrl: URL.createObjectURL(image),
                        url: downloadURL,
                        type: "image", // Set the type to "image"
                    };
    
                    setPostImages((images) => [...images, imageItem]);
    
                    console.log(downloadURL);
                });
            });
    }

    async function onSubmit(data: FormData) {
    
        const images = [];
        const videos = [];
    
        for (const post of postImages) {
            if (post.type === "video") {
                videos.push({
                    uid: post.uid,
                    name: post.name,
                    url: post.url,
                });
            } else {
                images.push({
                    uid: post.uid,
                    name: post.name,
                    url: post.url,
                });
            }
        }
    
        const postData = {
            description: data.description,
            created: new Date(),
            owner: user?.name,
            username: user?.username,
            uid: user?.uid,
            approved: 0,
            images: images,
            videos: videos,
        };
    
        try {
            await addDoc(collection(db, "posts"), postData);
            reset();
            setPostImages([]);
            toast.success("Post cadastrado com sucesso!", {
                position: 'bottom-right',
            });

            navigate(-1);
        } catch (error) {
            console.error(error);
        }
    }

    async function handleDeleteImage(item: ImageItemProps) {
        const imagePath = `images/${item.uid}/${item.name}`;

        const imageRef = ref(storage, imagePath);

        try {
            await deleteObject(imageRef);
            setPostImages(postImages.filter((post) => post.url !== item.url));
            toast.success("Postagem deleteada", {
                position: 'bottom-right',
            });
            window.location.reload();

        } catch(err) {
            	console.log("ERRO AO DELETAR");
        }
    }

    return (
        <Container>
            <div className="newPost">
                <h1>Fazer uma nova postagem</h1>

                <div className="formPost">
                <div className="w-full p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
                <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
                    <div className="absolute cursor-pointer">
                        <FiUpload size={30} color="#000"></FiUpload>
                    </div>
                    <div className="cursor-pointer">
                    <input
                    className="opacity-0 cursor-pointer"
                    type="file"
                    accept="image/*, video/mp4"
                    onChange={handleFile}
                    />
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
            <p>Descrição / Confissão</p>
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              name="description"
              placeholder="Digite uma descrição para a foto ou vídeo ou apenas se confesse..."
              className="h-32 w-full p-2 rounded-lg border border-gray-300"
            />
            {errors.description?.message && (
              <p className="text-red-500">{errors.description?.message}</p>
            )}
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