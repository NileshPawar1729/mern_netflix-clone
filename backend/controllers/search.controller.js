import userModel from "../models/user.model.js";
import { fetchFromTMDB } from "../services/tmdb.services.js";

export async function searchPerson(req, res) {
   let { query } = req.params;
   try {
      let data = await fetchFromTMDB(`https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`);

      if (data.results.length == 0) {
         return res.status(404).send(null);
      }

      await userModel.findByIdAndUpdate(req.user._id, {
         $push: {
            searchHistory: {
               id: data.results[0].id,
               image: data.results[0].profile_path,
               title: data.results[0].name,
               searchType: "person",
               createdAt: new Date()
            }
         }
      })

      res.status(200).json({ success: true, content: data.results });

   } catch (error) {
      console.log("Some error in search person controller", error.message);
      res.status(500).json({ success: false, message: "Internal Server Error" });
   }
}

export async function searchMovie(req, res) {
   let { query } = req.params;
   try {
      let data = await fetchFromTMDB(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`);

      if (data.results.length == 0) {
         return res.status(404).send(null);
      }

      await userModel.findByIdAndUpdate(req.user._id, {
         $push: {
            searchHistory: {
               id: data.results[0].id,
               image: data.results[0].poster_path,
               title: data.results[0].title,
               searchType: "movie",
               createdAt: new Date()
            }
         }
      })

      res.status(200).json({ success: true, content: data.results });

   } catch (error) {
      console.log("Some error in search movie controller", error.message);
      res.status(500).json({ success: false, message: "Internal Server Error" });
   }
}

export async function searchTv(req, res) {
   let { query } = req.params;
   try {
      let data = await fetchFromTMDB(`https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`);

      if (data.results.length == 0) {
         return res.status(404).send(null);
      }

      await userModel.findByIdAndUpdate(req.user._id, {
         $push: {
            searchHistory: {
               id: data.results[0].id,
               image: data.results[0].poster_path,
               title: data.results[0].name,
               searchType: "tv",
               createdAt: new Date()
            }
         }
      })

      res.status(200).json({ success: true, content: data.results });

   } catch (error) {
      console.log("Some error in search tv controller", error.message);
      res.status(500).json({ success: false, message: "Internal Server Error" });
   }
}

export async function getSearchHistory(req, res) {
   try {
      res.status(200).json({ success: true, content: req.user.searchHistory });
   } catch (error) {
      console.log("Some error in getHistory controller", error.message);
      res.status(500).json({ success: false, message: "Internal Server Error" });
   }
}

export async function removeItemFromSearchHistory(req,res) {
   let {id} = req.params;
   id = parseInt(id);
   try {
      await userModel.findByIdAndUpdate(req.user._id,{
         $pull:{
            searchHistory:{id:id}
         }
      })
      res.status(200).json({success:true,message:"Item deleted from history"})
   } catch (error) {
      console.log("Some error in removeSearchHistory controller", error.message);
      res.status(500).json({ success: false, message: "Internal Server Error" });
   }
}