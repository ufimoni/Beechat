import { Link } from "react-router-dom";
//// install react-router-dom
function Welcome(){
    return (
        <div className="HomePage">
            <h2 id="Homeh2">Welcome to BeeChat App</h2>
               <div className="HomePageButton">
               <Link to="/signup"><button className="Homebtn">Get Started!</button></Link> 
              
               </div>
            
        </div>
    )
    }
    export default Welcome;