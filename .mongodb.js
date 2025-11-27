// 1) 지금 이 DB 선택
use("instrumentdex");

// 2) .jpg -> .png로 일괄 변경
db.instruments.updateMany(
    { imageUrl: { $regex: /\.jpg$/ } },
    [
        {
            $set: {
                imageUrl: {
                    $replaceOne: {
                        input: "$imageUrl",
                        find: ".jpg",
                        replacement: ".png"
                    }
                }
            }
        }
    ]
);
