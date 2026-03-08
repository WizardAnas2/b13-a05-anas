//console.log("script added")
let allIssues = [];


const loginPage = document.getElementById('login-page');

const mainPage = document.getElementById('main-page');


const loginForm = document.getElementById('login-form');

const issuesContainer = document.getElementById('issues-container');

const loader = document.getElementById('loader');



const modal = document.getElementById('issue-modal');
const modalContent = document.getElementById('modal-content');

const searchInput = document.getElementById('search-input');

const searchBtn = document.getElementById('search-btn');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;


    if (user === 'admin' && pass === 'admin123') {
        loginPage.classList.add('hidden');
        mainPage.classList.remove('hidden');
        fetchAllIssues();
    } else {
        alert('Invalid credentials! Please use admin / admin123');
    }
});

const fetchAllIssues = async () => {
    showLoader(true);
    try {
        const response = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
        const result = await response.json();
        
        
        allIssues = result.data ?? [];
        
        updateCounts();
        renderIssues(allIssues);
    } catch (error) {
        console.error("Fetch Error:", error);
        issuesContainer.innerHTML = `<p class="text-red-500 col-span-full text-center py-10">Failed to load issues.</p>`;
    } finally {
        showLoader(false);
    }
};


const renderIssues = (issues) => {
    issuesContainer.innerHTML = '';
    
    if (!issues || issues.length === 0) {
        issuesContainer.innerHTML = `<p class="text-gray-500 col-span-full text-center py-10">No issues found.</p>`;
        return;
    }

    issues.forEach(issue => {
        const isClosed = issue.status?.toLowerCase() === 'closed';
        const borderColor = isClosed ? 'border-purple-500' : 'border-green-500';
        
       
        const statusImgSrc = isClosed ? 
             './assets/Closed- Status .png':
            './assets/Open-Status.png';

        const card = document.createElement('div');
        card.className = `bg-white rounded-lg shadow-sm border-t-4 ${borderColor} p-5 hover:shadow-md transition flex flex-col h-full`;

        const priority = issue.priority?.toLowerCase() || "low";

let priorityClasses = "";

if (priority === "high") {
    priorityClasses = "bg-red-100 text-red-600";
} 
else if (priority === "medium") {
    priorityClasses = "bg-yellow-100 text-yellow-700";
} 
else {
    priorityClasses = "bg-gray-200 text-gray-600";
}
        
card.innerHTML = `
<div class="flex flex-col h-full">
    <div class="flex justify-between items-center mb-3">

        <div class="w-8 h-8  flex items-center justify-center">
            <img src="${statusImgSrc}" class="w-6 h-6">
        </div>

        <span class="${priorityClasses} text-xs font-semibold px-3 py-1 rounded-full">
    ${priority.toUpperCase()}
</span>
    </div>
    
    <h3 onclick="showDetails('${issue.id}')" 
        class="font-bold text-gray-800 text-lg leading-tight mb-2 cursor-pointer hover:text-blue-600">
        ${issue.title ?? 'Untitled'}
    </h3>


    <p class="text-gray-500 text-sm mb-4 line-clamp-2">
        ${issue.description ?? 'No description.'}
    </p>
    <div class="flex gap-2 mb-4">
        <span class="flex items-center gap-1 text-xs font-semibold 
        text-red-400 bg-red-100 px-3 py-1 rounded-full">
            <i class="fa-solid fa-bug"></i> BUG
        </span>

        <span class="flex items-center gap-1 text-xs font-semibold 
        text-orange-400 bg-orange-100 px-3 py-1 rounded-full">
            <i class="fa-solid fa-triangle-exclamation"></i> HELP WANTED
        </span>

    </div>

</div><hr class= "text-gray-300">


<div class="pt-2 text-sm text-gray-500">

    <div>
        # 
        <a href="#" class="text-gray-700 hover:underline">
            ${issue.author ?? 'john_doe'}
        </a>
    </div>

    <div class="mt-1">
        ${issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : '1/15/2024'}
    </div>

</div>
`;
        issuesContainer.appendChild(card);
    });
};

const handleSearch = async () => {
    const query = searchInput.value.trim();
    if (!query) {
        renderIssues(allIssues);
        updateCounts();
        return;
    }

    showLoader(true);
    try {
        const response = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${query}`);
        const result = await response.json();
        const searchResults = result.data ?? [];
        renderIssues(searchResults);
        document.getElementById('count-all').innerText = searchResults.length;
    } catch (error) {
        console.error("Search failed:", error);
    } finally {
        showLoader(false);
    }
};

searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSearch(); });

const filterData =(status) =>{
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active-tab'));
    event.currentTarget.classList.add('active-tab');

    if(status=== 'all'){
        renderIssues(allIssues);
    } 
    else{
        const filtered = allIssues.filter(item => item.status?.toLowerCase() === status);
        renderIssues(filtered);
    }
};

const updateCounts =() =>{
    document.getElementById('count-all').innerText= allIssues.length;
    document.getElementById('count-open').innerText= allIssues.filter(i => i.status?.toLowerCase() === 'open').length;
    document.getElementById('count-closed').innerText= allIssues.filter(i => i.status?.toLowerCase() === 'closed').length;
};

const showDetails= async (id) => {
    try {
        const response= await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
        const result =await response.json();
        const issue= result.data ?? result;

        modalContent.innerHTML = `
            <div class="p-6">
                <h2 class="text-3xl font-bold text-[#1F2937] mb-2">${issue.title ?? 'Untitled'}</h2>
                <div class="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <span class="bg-[#10B981] text-white px-3 py-0.5 rounded-full text-xs font-medium">Opened</span>
                    <span>*</span>
                    <span>Opened by <span class="">${issue.author ?? 'Anonymous'}</span></span>
                    <span>*</span>
                    <span>${issue.createdAt ? new Date(issue.createdAt).toLocaleDateString('en-GB') : 'Invalid Date'}</span>
                </div>
                <div class="flex gap-2 mb-8">
                    <span class="px-2 py-1 rounded-full text-[15px] font-bold border bg-red-50 text-red-500 border-red-200 uppercase">
                        <i class="fa-solid fa-bug"></i> ${issue.label ?? 'BUG'}
                    </span>
                    <span class="px-2 py-1 rounded-full text-[15px] font-bold border bg-orange-50 text-orange-500 border-orange-100 uppercase">
                        <i class="fa-solid fa-triangle-exclamation"></i> HELP WANTED
                    </span>
                </div>
                <p class="text-[#4B5563] text-lg font--[16px] leading-relaxed mb-10">${issue.description ?? 'No description.'}</p>
                <div class="bg-gray-50/80 rounded-lg p-6 grid grid-cols-2 border border-gray-100">
                    <div>
                        <p class="text-gray-400 text-sm mb-1 font-semibold">Assignee:</p>
                        <p class="text-[#1F2937] font-bold text-lg"># ${issue.author ?? 'Unassigned'}</p>
                    </div>
                    <div>
                        <p class="text-gray-400 text-xs mb-1 font-semibold">Priority:</p>
                        <span class="bg-[#EF4444] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            ${issue.priority ?? 'HIGH'}
                        </span>
                    </div>
                </div>
            </div>
        `;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    } catch (error) {
        console.error("Modal Error:", error);
    }};

const closeModal= () =>{
    modal.classList.add('hidden');
    modal.classList.remove('flex');
};

const showLoader =(show) =>{
    loader.classList.toggle('hidden', !show);
    issuesContainer.classList.toggle('hidden', show);
};