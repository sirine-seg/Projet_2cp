from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from equipements_management.models import Equipement, CategorieEquipement
from interventions_management.models import Intervention
from accounts_management.models import User , Technicien
from django.db.models import Count, ExpressionWrapper, F, DurationField, Avg, Q, Case, When, CharField, Value
from datetime import timedelta as dt_timedelta
from django.db.models.functions import TruncMonth




# the view that calculates the number of interventions
class InterventionCountAPIView(APIView):
    def get(self, request):
        count = Intervention.objects.count()
        return Response({'intervention_count': count}, status=status.HTTP_200_OK)



# the view that calculates the number of Eqiupement
class EquipementCountAPIView(APIView):
    def get(self, request):
        count = Equipement.objects.count()
        return Response({'equipment_count': count}, status=status.HTTP_200_OK)

# the view that calculates the number of users
class UserCountAPIView(APIView):
    #permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        user_count = User.objects.count()
        return Response({'user_count': user_count}, status=status.HTTP_200_OK)


# this view is for the number of interventions by mounths
class InterventionsByMonthAPIView(APIView):
    def get(self, request):
        # Filter out interventions with no date_debut
        interventions = Intervention.objects.filter(date_debut__isnull=False).annotate(
            month=TruncMonth('date_debut')
        ).values('month').annotate(
            preventive_count=Count('id', filter=Q(type_intervention=Intervention.TYPE_PREVENTIVE)),
            currative_count=Count('id', filter=Q(type_intervention=Intervention.TYPE_CURRATIVE))
        ).order_by('month')

        # Format the response for each month
        response_data = []
        for item in interventions:
            response_data.append({
                'month': item['month'].strftime('%Y-%m'),
                'preventive_count': item['preventive_count'],
                'currative_count': item['currative_count']
            })

        return Response(response_data)



# the view that calculates the number of Technicians
class TechnicienCountAPIView(APIView):
    #permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        technician_count = Technicien.objects.count()
        return Response({'technician_count': technician_count}, status=status.HTTP_200_OK)




# the view that equipement percentage by etat
class EquipementPercentageByEtatAPIView(APIView):
    def get(self, request):
        total_equipments = Equipement.objects.count()
        if total_equipments == 0:
            return Response([], status=status.HTTP_200_OK)

        # Annotate group names: specific states or 'Autres' for the rest
        annotated_qs = Equipement.objects.annotate(
            group_name=Case(
                When(etat__nom__in=["En service", "En maintenance", "En panne"], then='etat__nom'),
                default=Value('Autres'),
                output_field=CharField(),
            )
        ).values('group_name').annotate(value=Count('etat_id')).order_by('group_name')

        # Prepare response list with grouped counts
        response = [{"name": item['group_name'], "value": item['value']} for item in annotated_qs]

        return Response(response, status=status.HTTP_200_OK)

# this view is to calculate the number of interventions by status

class InterventionStatusPercentageAPIView(APIView):
    def get(self, request):
        target_statuses = ["terminée", "en cours", "affecter", "en attente"]

        # Filter interventions only for the target statuses
        status_counts = (
            Intervention.objects
            .filter(statut__name__in=target_statuses)
            .values('statut__name')
            .annotate(count=Count('id'))
        )

        total_count = sum(item['count'] for item in status_counts)
        if total_count == 0:
            return Response([], status=status.HTTP_200_OK)

        status_percentages = [
            {
                'status': item['statut__name'],
                'percentage': round((item['count'] / total_count) * 100, 2)
            }
            for item in status_counts
        ]

        return Response(status_percentages, status=status.HTTP_200_OK)







# this view is for repartition des technicien par intervention

class TechnicianInterventionStatusPercentageAPIView(APIView):
    def get(self, request):
        target_statuses = ["terminée", "en cours", "annulée"]
        technicians = Technicien.objects.all()[:5]
        data = []

        for tech in technicians:
            interventions_qs = Intervention.objects.filter(technicien=tech, statut__name__in=target_statuses)
            total_interventions = interventions_qs.count()

            if total_interventions == 0:
                status_percentages = {}
            else:
                # Count interventions grouped by status only for target statuses
                status_counts = interventions_qs.values('statut__name').annotate(count=Count('id'))

                status_percentages = {
                    sc['statut__name']: round((sc['count'] / total_interventions) * 100, 2)
                    for sc in status_counts
                }

            data.append({
                "technician": str(tech),  # or tech.user.email or other identifier
                "total_interventions": total_interventions,
                "status_percentages": status_percentages,
            })

        return Response(data, status=status.HTTP_200_OK)



# this view is for delai moyen de resilution

class DelaiMoyenResolutionAPIView(APIView):
    def get(self, request):
        from interventions_management.models import InterventionCurrative

        completed_interventions = InterventionCurrative.objects.filter(
            date_fin__isnull=False, date_debut__isnull=False
        ).annotate(
            resolution_delay=ExpressionWrapper(
                F('date_fin') - F('date_debut'), output_field=DurationField()
            )
        )

        response_data = []
        categories = CategorieEquipement.objects.all()

        for category in categories:
            interventions_in_category = completed_interventions.filter(
                equipement__categorie=category
            )
            total = interventions_in_category.count()
            if total == 0:
                continue

            avg_duration = interventions_in_category.aggregate(
                avg_delay=Avg('resolution_delay')
            )['avg_delay']

            if avg_duration is not None:
                # Convert average duration to days
                avg_days = int (avg_duration.total_seconds() / (3600 * 24))
                response_data.append({
                    'category': category.nom,
                    'avgTime (days)': round(avg_days, 2)
                })

        return Response(response_data)