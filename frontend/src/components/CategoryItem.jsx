import { Link } from "react-router-dom"

function CategoryItem({category}) {
    return (
        <div className="category-item">
            <img className="thumbnail" style={{ backgroundImage: `url('/category-pictures/${category.image_path}'), url('/category-pictures/blank.png')` }}></img>
            <div className="bottom-grayscale-effect">
                <div className="category-name">{category.name}</div>
            </div>
        </div>
    )
}

export default CategoryItem