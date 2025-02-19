import { authentification_data } from '@/hooks/autentification&data';
import { getUserDetails } from '@/services/servicesUsers';
import Link from 'next/link';
import { productsByUser } from '../actions/order';
import PdfGenerator from './PdfGenerator';


export default async function ResumeBuy() {
    //recuperer l'user actuellement connecté + l'ID pour recupérer ses données des autres tables

    const { userId } = await authentification_data();  console.log("1 : ",userId);
    
    const userData = await getUserDetails(userId); console.log("2 : ",userData);
    

    //recuperer les commandes de l'utilisateur de lae données
    // const detailsBuy = await getOrder_user(userData.id);

    // console.log("3 : ", detailsBuy?.firstname);
    
    const listOrders = await productsByUser(userData?.id);

    console.log("4 : ",listOrders);

    
    
    //FAIS HISTORY order.  
    return (
      <div className=" grid grid-cols-1">
        <h2 className="text-lg font-bold text-gray-800">Factures</h2>
        <div>
          {listOrders?.length > 0 ? (
            <div className="h-80 overflow-y-auto space-y-4">
              {listOrders?.map((element) => (
                <p
                  key={element.id}
                  className="bg-white shadow rounded-lg p-4 border border-gray-200"
                >
                  <Link
                    href={`/${element.id}`}
                    className="text-gray-900 font-semibold mt-2"
                  >
                    {`${element.createdAt} : ${element.totalPrice} €`}
                  </Link>
                </p>
              ))}
            </div>
          ) : (
            <div>{`Vous n'avez pas encore de facture.`}</div>
          )}
          <PdfGenerator />
        </div>
      </div>
    );
    }
