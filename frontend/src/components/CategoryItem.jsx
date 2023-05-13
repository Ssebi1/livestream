import { Link } from "react-router-dom"

function CategoryItem({category, onPress}) {
    return (
        <div className="category-item" onClick={onPress}>
            <img className="thumbnail" style={{ backgroundImage: `url('/category-pictures/${category.image_path}'), url('/defaults/category-image.png')` }}></img>
            <div className="bottom-grayscale-effect">
                <div className="category-name">{category.name}</div>
            </div>
        </div>
    )
}

export default CategoryItem