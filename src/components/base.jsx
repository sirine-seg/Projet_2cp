return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E] rounded-r-md">
        
{/* Logo en haut à gauche */}
<Header />





        {/* En-tête */}
        <div className="w-full bg-[#20599E] text-white py-16 text-center">
       
        <h1 className="text-4xl sm:text-4xl md:text-3xl lg:text-5xl font-bold text-[#F4F4F4] mb-4 mt-2">
            Utilisateurs
        </h1>
        {/* bare de recherhce  */}    
<SearchBar
value={searchTerm}
onChange={e => setSearchTerm(e.target.value)}
placeholder="Rechercher (nom, email, rôle...)"
/>

</div>

<div className="w-full min-h-screen rounded-t-[45px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 shadow-md flex flex-col bg-[#F4F4F4] -mt-12">

    
</div>
</div>