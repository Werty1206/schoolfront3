import { Header } from "./components/header/header";



export const App = (props) =>{
    return (
        <> 
        <Header />
        {props.children} 
   
      </> 
  
    )
}