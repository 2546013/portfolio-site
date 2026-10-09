fetch("works.csv")
    .then(function(response) {return response.text();})

    .then(function(data) {

        // CSVを行ごとに分割
        var rows = data.trim().split("\n");

        // 1行目は見出し
        var headers = rows[0].split(",");

        // 2行目以降を作品データにする
        var works = rows.slice(1).map(function(row) {

            var values = row.split(",");

            var work = {};

            headers.forEach(function(header, index) {
                work[header] = values[index];
            });
            
            return work;
        });

        // Worksを表示する場所
        var grid = document.getElementById("work-grid");
        
        // 作品を1つずつ表示
        works.forEach(function(work) {
            var card = document.createElement("article");

            card.className = "work-card";

            card.innerHTML =
                '<a href="' + work.link + '">' +
                    '<img src="' + work.image + '" alt="' + work.title + '">' + 
                    '<h4>' + work.title + '</h4>' + 
                    '<p>' + work.description + '</p>' + 
                '</a>';

            grid.appendChild(card);
        });
    })