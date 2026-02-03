import { useNavigate } from "react-router-dom";

export default function ProductCard({ p }) {

  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/product/${p.id}`)} className="cursor-pointer">

      <img
        src={p.imageUrl || "https://via.placeholder.com/300"}
        className="h-48 w-full object-cover"
      />

      <h3 className="mt-2 font-semibold">{p.name}</h3>
      <p>₹{p.price}</p>

    </div>
  );
}
