import React, {useRef} from 'react';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Create Document Component
const PDFFile = () => {
    const pdfRef = useRef();
    const data = localStorage.getItem('data')
    console.log(data)
    const dowloadPDF = () => {
        const input = pdfRef.current;
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'pt', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Calculate the ratio of the canvas width to the pdf width
            const ratio = canvas.width / pdfWidth;

            // Calculate the height of the image in the pdf, maintaining the original aspect ratio
            const imgHeight = canvas.height / ratio;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
            pdf.save("download.pdf");
        });
    }


    return (


        <div className="relative overflow-x-auto flex justify-center items-center flex-col">
            <table ref={pdfRef} className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        Product name
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Color
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Category
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Price
                    </th>
                </tr>
                </thead>
                <tbody>
                {
                    data && JSON.parse(data).map((item, index) => (
                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {item.name}
                            </th>
                            <td className="px-6 py-4">
                                {item.color}
                            </td>
                            <td className="px-6 py-4">
                                {item.category}
                            </td>
                            <td className="px-6 py-4">
                                {item.price}
                            </td>
                        </tr>
                    ))
                }

                </tbody>
            </table>
            <button
                onClick={dowloadPDF}
                className='bg-amber-100 px-2 py-2 rounded mt-3 w-fit ease-in duration-100 hover:bg-primary hover:text-white  '>
                download
            </button>
        </div>

    )


}


export default PDFFile;