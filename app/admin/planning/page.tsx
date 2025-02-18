import CreatePlanning from '@/app/components/CreatePlanning'
import Planning from '@/app/components/Planning'

export default function pagePlanning() {
  return (
<div className=" md:overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-teal-700">
  <h1 className="text-2xl sm:text-4xl font-bold text-amber-300 mb-3 sm:mb-4 drop-shadow-lg text-center mt-10">Gestion du planning</h1>
  <div className="flex justify-center items-center md:items-start flex-col md:flex-row md:justify-between gap-10 p-4">
    {/* Section pour le Planning */}
    <div className="max-h-[90vh] w-[80%] md:w-[60%] bg-gray-900 p-3 rounded-lg shadow-lg overflow-auto text-amber-300">
    <Planning />
  </div>

    {/* Section pour le formulaire */}
    <div className="w-[80%] md:w-1/3 h-full max-h-[85vh]  text-slate-50 p-4 rounded-lg shadow-lg">
      <CreatePlanning />
    </div>
  </div>
</div>
  )
}
