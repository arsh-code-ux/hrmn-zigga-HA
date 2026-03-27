import digitalImg from "../assets/images/artists/PRASENJIT NATH.jpg";
import drawingImg from "../assets/images/artists/Devika Pal.jpg";
import paintingImg from "../assets/images/artists/Meenu Goyal.jpeg";
import sculptureImg from "../assets/images/artists/Richard Anbudurai.jpeg";

import logo from "../assets/images/Logo.png";

const artistTypes = [
  {
    id: 0,
    label: "Digital Artist",
    type: "digital",
    thumb: digitalImg,
    background: logo,
  },
  {
    id: 1,
    label: "Drawings",
    type: "drawings",
    thumb: drawingImg,
    background: logo,
  },
  {
    id: 2,
    label: "Paintings",
    type: "paintings",
    thumb: paintingImg,
    background: logo,
  },
  {
    id: 3,
    label: "Sculpture",
    type: "sculpture",
    thumb: sculptureImg,
    background: logo,
  },
];

export default artistTypes;
