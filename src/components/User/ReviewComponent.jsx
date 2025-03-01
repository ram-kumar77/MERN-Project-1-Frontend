// import { useState, useEffect } from "react";
// import axios from "axios";

// const ReviewComponent = () => {
//   const [reviews, setReviews] = useState([]);
//   const [user, setUser] = useState("admin@example.com"); // Set a default user or fetch from context
//   const [text, setText] = useState("");
//   const [rating, setRating] = useState(5);

//   // Fetch Reviews
//   useEffect(() => {
//     axios.get("http://localhost:5000/reviews").then((res) => setReviews(res.data));
//   }, []);

//   // Add Review
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const newReview = { user, text, rating };

//     try {
//       const res = await axios.post("http://localhost:5000/reviews", newReview);
//       setReviews([res.data, ...reviews]);
//       setUser(""); // Reset user if needed
//       setText("");
//       setRating(5);
//     } catch (error) {
//       console.error("Error submitting review", error);
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto p-4">
//       <h2 className="text-xl font-bold mb-2">Add a Review</h2>
//       <form onSubmit={handleSubmit} className="space-y-2">
//         <textarea
//           placeholder="Your Review"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           required
//           className="w-full p-2 border rounded"
//         ></textarea>
//         <input
//           type="number"
//           min="1"
//           max="5"
//           value={rating}
//           onChange={(e) => setRating(e.target.value)}
//           required
//           className="w-full p-2 border rounded"
//         />
//         <button type="submit" className="bg-blue-500 text-white p-2 rounded">
//           Submit Review
//         </button>
//       </form>

//       <h2 className="text-xl font-bold mt-4">Reviews</h2>
//       {reviews.length === 0 ? <p>No reviews yet.</p> : (
//         reviews.map((review) => (
//           <div key={review._id} className="border p-2 mt-2 rounded">
//             <h3 className="font-bold">{review.user} ⭐ {review.rating}/5</h3>
//             <p>{review.text}</p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default ReviewComponent;
