fetch("works.csv")
    .then(function(response) {
        return response.text();
    })
    .then(function(data) {

        // CSVデータを行ごとに分割
        var rows = data.trim().split("\n");
        if (rows.length <= 1 || rows[0] === "") return;

        // 1行目は見出し
        var headers = rows[0].split(",");

        // 2行目以降を作品データにする
        var works = rows.slice(1).map(function(row) {
            var values = row.split(",");
            var work = {};
            headers.forEach(function(header, index) {
                work[header.trim()] = values[index] ? values[index].trim() : "";
            });
            return work;
        });

        // HTML要素を取得
        var grid = document.getElementById("works-grid");
        var categorySelect = document.getElementById("category");
        var sortSelect = document.getElementById("sort");

        // カテゴリー一覧を作る
        var categories = [];
        works.forEach(function(work) {
            if (work.category && !categories.includes(work.category)) {
                categories.push(work.category);
            }
        });

        // select要素にカテゴリーを追加
        categories.forEach(function(category) {
            var option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });

        // 作品を表示する関数
        function displayWorks() {
            var selectedCategory = categorySelect.value;
            var sortType = sortSelect.value;
            var filteredWorks = works.slice();

            // カテゴリーでフィルタリング
            if (selectedCategory !== "all") {
                filteredWorks = filteredWorks.filter(function(work) {
                    return work.category === selectedCategory;
                });
            }

            // ソート処理（関数内に移動）
            if (sortType === "new") {
                filteredWorks.sort(function(a, b) {
                    return Number(b.year) - Number(a.year);
                });
            } else if (sortType === "old") {
                filteredWorks.sort(function(a, b) {
                    return Number(a.year) - Number(b.year);
                });
            } else if (sortType === "title") {
                filteredWorks.sort(function(a, b) {
                    return (a.title || "").localeCompare(b.title || "");
                });
            }

            // 画面を一度空にする
            grid.innerHTML = "";

            // 作品を1つずつ表示
            filteredWorks.forEach(function(work) {
                var card = document.createElement("article");
                card.className = "work-card";
                card.innerHTML = 
                '<a href="' + (work.link || '#') + '">' +
                    '<img class="work-cardimg" src="' + (work.image || '') + '" alt="' + (work.title || '') + '">' +
                    '<div class="work-info">' +
                        '<h4>' + (work.title || '') + '</h4>' +
                        '<p>' + (work.description || '') + '</p>' +
                        '<p class="work-year">' + (work.year || '') + '</p>' +
                    '</div>' +
                '</a>';
                grid.appendChild(card);
            });
        }

        // 最初に表示
        displayWorks();

        // カテゴリーやソートが変更されたときの処理
        categorySelect.addEventListener("change", displayWorks);
        sortSelect.addEventListener("change", displayWorks);
    })
    .catch(function(error) {
        console.error("CSVファイルの読み込み中にエラーが発生しました:", error);
    });