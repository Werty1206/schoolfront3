import { Header } from "./components/header/header";
import { AvatarProvider } from "./context/avatarContext";


export const App = (props) =>{
    return (
        <AvatarProvider> 
        <Header />
        {props.children} 
   
        </AvatarProvider> 
  
    )
}