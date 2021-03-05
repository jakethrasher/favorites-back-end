function mungeData(movies){
  return movies.map(item=>{
    return {
      title:item.original_title,
      year:item.release_date,
      overview:item.overview,
      poster:item.poster_path,
      rating:item.vote_average * 10,
      movie_db_id:item.id,
    }; 
  });
}
module.exports = {
  mungeData
};