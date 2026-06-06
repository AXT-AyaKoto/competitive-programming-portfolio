export { };

const DATA = "./data";

await new Promise((resolve) => {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => resolve());
    } else {
        resolve();
    }
});

try {
    const [history, acRank, languageRank, submissionsJson, info] = await Promise.all([
        fetch(`${DATA}/history.json`).then((r) => r.json()),
        fetch(`${DATA}/ac_rank.json`).then((r) => r.json()),
        fetch(`${DATA}/language_rank.json`).then((r) => r.json()),
        fetch(`${DATA}/submissions.json`).then((r) => r.json()),
        fetch(`${DATA}/info.json`).then((r) => r.json()),
    ]);

    const currentRating =
        [...history]
            .sort((a, b) => new Date(b.EndTime) - new Date(a.EndTime))
            .find((c) => typeof c.NewRating === "number")?.NewRating ?? "-";

    const acCount = acRank.count;

    const languages = [...languageRank]
        .sort((a, b) => b.count - a.count)
        .map((language) => ({
            name: language.language.split(" ")[0],
            count: language.count,
        }));

    const submissions = submissionsJson
        .sort((a, b) => b.epoch_second - a.epoch_second)
        .map((submission) => ({
            problem: submission.problem_id.toUpperCase(),
            language: submission.language.split(" ")[0],
            result: submission.result,
            result_color: submission.result === "AC" ? "success" : "warning",
            submission_link: `https://atcoder.jp/contests/${submission.contest_id}/submissions/${submission.id}`,
        })).slice(0, 20);

    document.getElementById("current-rating").textContent = currentRating;
    document.getElementById("ac-count").textContent = acCount;

    document.getElementById("languages").innerHTML = languages
        .map(
            (lang) => `
        <li>
            <span class="d-inline-flex rounded-pill overflow-hidden border">
                <span class="badge rounded-0 text-bg-primary px-3 py-2">${lang.name}</span>
                <span class="badge rounded-0 text-bg-secondary px-3 py-2">${lang.count} AC</span>
            </span>
        </li>`,
        )
        .join("");

    document.getElementById("submissions-table-body").innerHTML = submissions
        .map(
            (submission) => `
        <tr>
            <td class="text-center align-middle">${submission.problem}</td>
            <td class="text-center align-middle">${submission.language}</td>
            <td class="text-center align-middle">
                <span class="badge text-bg-${submission.result_color}">${submission.result}</span>
            </td>
            <td class="text-center align-middle">
                <a href="${submission.submission_link}" target="_blank" rel="noopener noreferrer">
                    <i class="fa-solid fa-up-right-from-square"></i>
                </a>
            </td>
        </tr>`,
        )
        .join("");

    document.getElementById("last-updated").textContent = new Date(info.updated_at).toLocaleString("ja-JP");
} catch (error) {
    console.error("Failed to load portfolio data:", error);
    document.getElementById("last-updated").textContent = "Error loading data";
}
